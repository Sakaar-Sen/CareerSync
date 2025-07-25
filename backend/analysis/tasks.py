# analysis/tasks.py

import os
import json
import fitz
from celery import shared_task
from openai import OpenAI
from .models import AnalysisJob

client = OpenAI(
    base_url="https://api.electronhub.ai/v1",
    api_key=os.getenv('API_KEY'),
)

@shared_task
def perform_analysis(job_id, resume_pdf_content, job_description_text, career_level):
    job = None
    try:
        job = AnalysisJob.objects.get(id=job_id)

        pdf_document = fitz.open(stream=resume_pdf_content, filetype="pdf")
        resume_text = ""
        for page in pdf_document:
            resume_text += page.get_text()
        
        if not resume_text:
            raise ValueError("Could not extract text from the provided PDF.")

        system_prompt = f"""
        You are an expert career coach and professional resume writer. 
        Your task is to analyze a candidate's resume against a specific job description for a candidate at the '{career_level}' level.
        Respond ONLY with a valid JSON object.
        """

        user_prompt = f"""
        Analyze the following RESUME TEXT and JOB DESCRIPTION for a '{career_level}' candidate.

        [RESUME TEXT]:
        {resume_text}

        [JOB DESCRIPTION]:
        {job_description_text}

        Now, provide your analysis in a JSON object with the following structure:
        {{
          "matchScore": <A percentage score from 0-100>,
          "keywordAnalysis": {{
            "missingKeywords": ["<A list of 5-7 most important missing keywords>"],
            "strongKeywords": ["<A list of 3-5 strong matching keywords>"]
          }},
          "summarySuggestion": "<A rewritten professional summary, 3-4 sentences long, tailored for the career level>",
          "bulletPointSuggestions": [
            {{
              "original": "<An original bullet point from the resume that could be improved>",
              "rewritten": "<A rewritten, more impactful version of that bullet point>"
            }}
          ]
        }}
        """

        response = client.chat.completions.create(
            model="llama-3.1-8b",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format={"type": "json_object"}
        )
        
        result_json_string = response.choices[0].message.content
        job.result = json.loads(result_json_string)
        job.status = AnalysisJob.StatusChoices.SUCCESS

    except Exception as e:
        print(f"Error analyzing job {job_id}: {e}")
        if job:
            job.status = AnalysisJob.StatusChoices.FAILURE
            job.result = {"error": str(e)}
    finally:
        if job:
            job.save()

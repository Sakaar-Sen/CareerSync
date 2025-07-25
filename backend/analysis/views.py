from django.http import HttpResponse
from django.template.loader import get_template
from django.shortcuts import get_object_or_404
from weasyprint import HTML
from rest_framework import generics, status
from rest_framework import views
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import AnalysisJob
from .serializers import AnalysisJobSerializer
from .tasks import perform_analysis
from rest_framework.permissions import IsAuthenticated


class CreateAnalysisView(generics.CreateAPIView):
    queryset = AnalysisJob.objects.all()
    serializer_class = AnalysisJobSerializer
    parser_classes = [MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        job_description_text = request.data.get('job_description_text', '')
        resume_pdf = request.FILES.get('resume_pdf')
        career_level = request.data.get('career_level', 'Not Specified')

        if not resume_pdf or not job_description_text:
            return Response(
                {"error": "Resume PDF and Job Description are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(data={})
        serializer.is_valid(raise_exception=True)

        user = request.user if request.user.is_authenticated else None
        job = serializer.save(user=user)

        resume_pdf_content = resume_pdf.read()
        perform_analysis.delay(job.id, resume_pdf_content, job_description_text, career_level)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED, headers=headers)


class AnalysisHistoryView(generics.ListAPIView):
    serializer_class = AnalysisJobSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return AnalysisJob.objects.filter(user=self.request.user).order_by('-created_at')


class JobStatusView(views.APIView):
    def get(self, request, task_id, *args, **kwargs):
        try:
            job = AnalysisJob.objects.get(task_id=task_id)
            serializer = AnalysisJobSerializer(job)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except AnalysisJob.DoesNotExist:
            return Response({"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND)
        

def download_report_view(request, task_id):
    job = get_object_or_404(AnalysisJob, task_id=task_id)

    if job.status != 'SUCCESS' or not job.result:
        return HttpResponse("Report not ready or analysis failed.", status=404)

    score = job.result.get('matchScore', 0)
    if score >= 75:
        score_color = '#059669' 
    elif score >= 50:
        score_color = '#f59e0b' 
    else:
        score_color = '#ef4444' 

    template = get_template('report.html')

    context = {"result": job.result, "score_color": score_color}
    html_string = template.render(context)
    
    pdf_file = HTML(string=html_string).write_pdf()

    response = HttpResponse(pdf_file, content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="CareerSync-Report.pdf"'
    
    return response


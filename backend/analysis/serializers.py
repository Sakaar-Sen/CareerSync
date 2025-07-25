from rest_framework import serializers
from .models import AnalysisJob

class AnalysisJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalysisJob
        fields = ['task_id', 'status', 'result', 'created_at']
        read_only_fields = ['status', 'result', 'created_at']

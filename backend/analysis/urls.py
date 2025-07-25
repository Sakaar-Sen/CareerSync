from django.urls import path
from .views import CreateAnalysisView, JobStatusView, AnalysisHistoryView, download_report_view

urlpatterns = [
    path('analyze/', CreateAnalysisView.as_view(), name='create-analysis'),
    path('jobs/<uuid:task_id>/download/', download_report_view, name='download-report'),
    path('jobs/<uuid:task_id>/', JobStatusView.as_view(), name='job-status'),
    path('history/', AnalysisHistoryView.as_view(), name='analysis-history'),

]
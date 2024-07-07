from django.shortcuts import render

def serve_index(request):
    # Render the index.html template
    return render(request, 'spa/spa.html')
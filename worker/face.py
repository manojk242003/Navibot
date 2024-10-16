from flask import Flask, request, jsonify
import torch
import torch.nn as nn
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
from torch.nn.functional import cosine_similarity
import os

# Initialize Flask app
app = Flask(__name__)

# Load pre-trained MobileNet model
mobilenet = models.mobilenet_v2(pretrained=True)
mobilenet.eval()  # Set model to evaluation mode

# Remove the last layer to get the second-to-last vector
mobilenet.classifier = nn.Sequential(*list(mobilenet.classifier.children())[:-1])

# Define image transformation (resize, normalize, etc.)
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def image_to_feature_vector(image, model):
    # Load and preprocess the image
    image = Image.open(image).convert('RGB')
    image = transform(image).unsqueeze(0)  # Add batch dimension
    
    # Pass image through the model
    with torch.no_grad():
        feature_vector = model(image)
    
    return feature_vector

def similarity_between_images(image1, image2, model, similarity_metric='cosine'):
    # Get feature vectors for both images
    feature_vector1 = image_to_feature_vector(image1, model)
    feature_vector2 = image_to_feature_vector(image2, model)
    
    # Calculate similarity
    if similarity_metric == 'cosine':
        similarity_score = cosine_similarity(feature_vector1, feature_vector2)
        # Convert cosine similarity from [-1, 1] to [0, 1] for probability-like percentage.
        probability = ((similarity_score.item() + 1) / 2) * 100
    elif similarity_metric == 'euclidean':
        similarity_score = torch.dist(feature_vector1, feature_vector2, p=2)
        # Convert Euclidean distance to a similarity percentage (lower distance = higher similarity).
        # Here, we assume a threshold for "maximum similarity" distance as 10 for demonstration.
        max_distance = 10.0
        probability = max(0, 100 - (similarity_score.item() / max_distance) * 100)
    else:
        raise ValueError("Unsupported similarity metric. Choose either 'cosine' or 'euclidean'.")
    
    return probability

@app.route('/upload', methods=['POST'])
def upload_images():
    # Check if the request has the image files
    if 'image1' not in request.files or 'image2' not in request.files:
        return jsonify({'error': 'Please upload two images'}), 400

    image1 = request.files['image1']
    image2 = request.files['image2']

    # Check if files are valid
    if image1.filename == '' or image2.filename == '':
        return jsonify({'error': 'Invalid image files'}), 400

    try:
        # Calculate similarity as probability
        probability = similarity_between_images(image1, image2, mobilenet)
        return jsonify({'similarity_probability': probability}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3001)



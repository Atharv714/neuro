from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__)

# Path to the 'uploads' folder on your desktop
UPLOAD_FOLDER = 'edamood/uploads'  # Change 'YourUsername' to your username
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def index():
    # List all image files in the upload folder
    images = os.listdir(app.config['UPLOAD_FOLDER'])
    images = [img for img in images if img.endswith(('jpg', 'jpeg', 'png', 'gif'))]  # Filter image files
    
    # Get the most recently added image (last added)
    if images:
        last_image = max(images, key=lambda x: os.path.getctime(os.path.join(app.config['UPLOAD_FOLDER'], x)))
    else:
        last_image = None  # If no images, set to None

    return render_template('index.html', images=images, last_image=last_image)

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True)

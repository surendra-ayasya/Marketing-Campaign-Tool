import os
from flask import Flask, request, render_template
from werkzeug.utils import secure_filename
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()  # Loads .env if you use it

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/uploads'
client = OpenAI(api_key="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")  # Or directly paste key: api_key="sk-..."

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate_image():
    prompt = request.form.get('prompt') or "Generate product image"
    uploaded_image = request.files.get('image')
    uploaded_image_path = None

    if uploaded_image:
        filename = secure_filename(uploaded_image.filename)
        uploaded_image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        uploaded_image.save(uploaded_image_path)

    try:
        response = client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            n=1,
            size="1024x1024",
            quality="standard"
        )
        image_url = response.data[0].url
        return render_template(
            'index.html',
            generated_image_url=image_url,
            uploaded_image_url=uploaded_image_path,
            used_prompt=prompt
        )
    except Exception as e:
        return {"error": str(e)}, 500

if __name__ == '__main__':
    app.run(debug=True)

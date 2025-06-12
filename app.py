import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()  # Loads .env if you use it

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/uploads'
client = OpenAI(api_key="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")  # Or directly paste key: api_key="sk-..."
CORS(app)


@app.route('/generate', methods=['POST'])
def generate_image():
    print("🔥 /generate endpoint hit")
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
        return jsonify({
            "generated_image_url": image_url,
            "uploaded_image_url": uploaded_image_path,
            "used_prompt": prompt
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)


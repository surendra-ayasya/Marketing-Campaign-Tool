document.getElementById('campaign-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const prompt = document.getElementById('prompt').value;
    const image = document.getElementById('image').files[0];
    const generatedImage = document.getElementById('generated-image');
    const errorElement = document.getElementById('error');

    // Reset previous results
    generatedImage.style.display = 'none';
    errorElement.style.display = 'none';

    const formData = new FormData();
    formData.append('prompt', prompt);
    if (image) {
        formData.append('image', image);
    }

    try {
        const response = await fetch('/generate', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            generatedImage.src = result.image_url;
            generatedImage.style.display = 'block';
        } else {
            errorElement.textContent = result.error || 'An error occurred';
            errorElement.style.display = 'block';
        }
    } catch (error) {
        errorElement.textContent = 'Network error: ' + error.message;
        errorElement.style.display = 'block';
    }
});
from flask import Flask, render_template, request, jsonify
from deep_translator import GoogleTranslator

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/translate', methods=['POST'])
def translate_text():
    data = request.get_json()
    text = data.get('text')
    source_lang = data.get('source') or 'auto'
    target_lang = data.get('target')

    if not text or not target_lang:
        return jsonify({'error': 'Faltan datos'}), 400

    try:
        translated_text = GoogleTranslator(source=source_lang, target=target_lang).translate(text)
        return jsonify({'translated_text': translated_text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ⚠️ SOLO para pruebas locales, nunca en producción
if __name__ == '__main__':
    app.run(debug=True, port=3001)

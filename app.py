from flask import Flask, render_template, request, jsonify
from googletrans import Translator

app = Flask(__name__)
translator = Translator()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/translate', methods=['POST'])
def translate_text():
    data = request.get_json()

    text = data.get('text', '').strip()
    source_lang = data.get('source') or 'auto'
    target_lang = data.get('target')

    if not text or not target_lang:
        return jsonify({'error': 'Faltan datos o idiomas inválidos'}), 400

    try:
        result = translator.translate(text, src=source_lang, dest=target_lang)
        return jsonify({'translated_text': result.text})
    except Exception as e:
        return jsonify({'error': f'Error al traducir: {str(e)}'}), 500

# ⚠️ Para desarrollo local solamente
if __name__ == '__main__':
    app.run(debug=True, port=3001)

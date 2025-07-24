from flask import Flask, render_template, request, jsonify
from googletrans import Translator

app = Flask(__name__)
translator = Translator()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/translate', methods=['POST'])
def translate_text():
    text = request.form.get('text') or (request.json.get('text') if request.is_json else None)
    source_lang = request.form.get('source') or (request.json.get('source') if request.is_json else None)
    target_lang = request.form.get('target') or (request.json.get('target') if request.is_json else None)

    if not text or not target_lang:
        return jsonify({'error': 'Faltan datos'}), 400

    try:
        result = translator.translate(text, src=source_lang or 'auto', dest=target_lang)
        return jsonify({'translated_text': result.text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=3001)

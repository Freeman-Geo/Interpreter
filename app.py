from flask import Flask, request, jsonify, render_template
import requests

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/traducir", methods=["POST"])
def traducir():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No se recibió JSON"}), 400

    texto = data.get("q")
    source = data.get("source")
    target = data.get("target")

    if not texto or not source or not target:
        return jsonify({"error": "Faltan datos: texto, source o target"}), 400

    try:
        # 👉 API pública de LibreTranslate
        response = requests.post(
            "https://libretranslate.de/translate",
            json={
                "q": texto,
                "source": source,
                "target": target,
                "format": "text"
            },
            headers={"Content-Type": "application/json"},
            timeout=10
        )

        if response.status_code != 200:
            return jsonify({"error": f"Error en traducción. Código HTTP: {response.status_code}"}), 500

        try:
            resultado = response.json()
        except ValueError:
            return jsonify({"error": "Respuesta no fue JSON válido"}), 500

        translated = resultado.get("translatedText")
        if not translated:
            return jsonify({"error": "No se recibió texto traducido"}), 500

        return jsonify({"translatedText": translated})

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Error de red: {str(e)}"}), 500

    except Exception as e:
        return jsonify({"error": f"Error inesperado: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0", port=10000)

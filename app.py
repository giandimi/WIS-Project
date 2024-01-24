# BEGIN CODE HERE
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from pymongo import TEXT
import numpy as np
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
# END CODE HERE

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://127.0.0.1:27017/pspi"
CORS(app)
mongo = PyMongo(app)
mongo.db.products.create_index([("name", TEXT)])


@app.route("/search", methods=["GET"])
def search():
    # BEGIN CODE HERE

    search_text = request.args.get('name', '')
    # search_text = str(request.args.get('name', ''))

    if not search_text:
        return jsonify([])
    results = mongo.db.products.find({"name": {"$regex": search_text, "$options": "i"}}).sort('price', -1)
    response = []

    for result in results:
        response.append({
            'id': str(result['_id']),
            'name': result['name'],
            'production_year': result['production_year'],
            'price': result['price'],
            'color': result['color'],
            'size': result['size']
        })
    response.reverse()
    return jsonify(response)

    # END CODE HERE


@app.route("/add-product", methods=["POST"])
def add_product():
    # BEGIN CODE HERE
    data = None

    if request.headers.get('Content-Type') == 'application/json':
        data = request.get_json()

    if data is None:
        return "Invalid data", 400

    # Access data as dictionary
    new_product = {}
    new_product["name"] = data.get('name')
    new_product["production_year"] = int(data.get('production_year'))
    new_product["price"] = float(data.get('price'))
    new_product["color"] = int(data.get('color'))
    new_product["size"] = int(data.get('size'))

    exists = mongo.db.products.find_one({"name": new_product["name"]})
    if exists is None:
        mongo.db.products.insert_one(new_product)
        return "", 200
    else:
        mongo.db.products.update_one({"name": new_product["name"]}, {"$set": {"production_year": new_product["production_year"],"price": new_product["price"],"color": new_product["color"], "size": new_product["size"]}})
        return "", 200
    # END CODE HERE


@app.route("/content-based-filtering", methods=["POST"])
def content_based_filtering():
    # BEGIN CODE HERE
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    new_product_name = data['name']
    new_product_features = np.array([data['production_year'], data['price'], data['color'], data['size']])
    similar_products = []

    products = mongo.db.products.find()
    for product in products:
        if product['name'] == new_product_name:
            return jsonify({'error': 'Product already exists'}), 400

        existing_product_features = np.array(
            [product['production_year'], product['price'], product['color'], product['size']])
        cosine_similarity = np.dot(new_product_features, existing_product_features) / (
                np.linalg.norm(new_product_features) * np.linalg.norm(existing_product_features))
        if cosine_similarity > 0.7:
            similar_products.append(product['name'])

    return jsonify(similar_products), 200
    # END CODE HERE


@app.route("/crawler", methods=["GET"])
def crawler():
    # BEGIN CODE HERE

    semester = int(request.args.get('semester'))

    options = Options()
    options.headless = True
    driver = webdriver.Chrome(options=options)

    driver.get("https://qa.auth.gr/el/x/studyguide/600000438/current")

    res = []
    try:

        table_id = "exam" + str(semester)
        table = driver.find_element(By.ID, table_id)
        rows = table.find_elements(By.TAG_NAME, "tr")[1:]

        for row in rows:

            title_elements = row.find_elements(By.CLASS_NAME, "title")
            if title_elements:
                title = title_elements[0].text
                if title:
                    res.append(title)
    except Exception as e:
        print(str(e))


    driver.quit()
    return jsonify(res), 200

    # END CODE HERE

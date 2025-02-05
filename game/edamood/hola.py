import matplotlib
matplotlib.use('Agg')  # Use a non-GUI backend


from flask import Flask, render_template, request, jsonify
import matplotlib.pyplot as plt
import numpy as np
import os
import json
import requests

app = Flask(__name__)

with open("/Users/atharvrastogi/Documents/GitHub/MSC-GAME/mood.json", "r") as file:
    data = file.read()

parsed_data = json.loads(data)
mood = parsed_data["mood"]

print(mood)


def visualize_health_analysis(emotion):
    health_analysis = {
        "happy": {"mental_health": 9, "physical_health": 8, "energy_levels": 9, "stress_levels": 2, "sleep_quality": 8, "social_interaction": 9},
        "neutral": {"mental_health": 7, "physical_health": 6, "energy_levels": 7, "stress_levels": 4, "sleep_quality": 7, "social_interaction": 7},
        "sad": {"mental_health": 4, "physical_health": 5, "energy_levels": 3, "stress_levels": 7, "sleep_quality": 5, "social_interaction": 4},
        "angry": {"mental_health": 3, "physical_health": 4, "energy_levels": 6, "stress_levels": 9, "sleep_quality": 4, "social_interaction": 3},
        "anxious": {"mental_health": 5, "physical_health": 4, "energy_levels": 4, "stress_levels": 8, "sleep_quality": 5, "social_interaction": 5}
    }
    
    if emotion.lower() not in health_analysis:
        return None
    
    categories = ["Mental Health", "Physical Health", "Energy Levels", "Stress Levels", "Sleep Quality", "Social Interaction"]
    values = [health_analysis[emotion.lower()][key] for key in health_analysis[emotion.lower()]]
    
    plt.figure(figsize=(12, 6))
    
    plt.subplot(2, 3, 1)
    plt.bar(categories, values, color=["blue", "green", "orange", "red", "purple", "cyan"])
    plt.ylim(0, 10)
    plt.ylabel("Health Score (1-10)")
    plt.title(f"Bar Chart: {emotion.capitalize()}")
    plt.xticks(rotation=45)
    
    plt.subplot(2, 3, 2)
    plt.pie(values, labels=categories, autopct='%1.1f%%', colors=["blue", "green", "orange", "red", "purple", "cyan"])
    plt.title(f"Pie Chart: {emotion.capitalize()}")
    
    plt.subplot(2, 3, 3)
    plt.plot(categories, values, marker='o', linestyle='-', color='magenta')
    plt.ylim(0, 10)
    plt.xticks(rotation=45)
    plt.ylabel("Health Score")
    plt.title(f"Line Graph: {emotion.capitalize()}")
    
    plt.subplot(2, 3, 4)
    plt.scatter(categories, values, color='brown')
    plt.ylim(0, 10)
    plt.xticks(rotation=45)
    plt.ylabel("Health Score")
    plt.title(f"Scatter Plot: {emotion.capitalize()}")
    
    plt.subplot(2, 3, 5)
    plt.hist(values, bins=5, color='teal', edgecolor='black')
    plt.xlabel("Health Score")
    plt.ylabel("Frequency")
    plt.title(f"Histogram: {emotion.capitalize()}")
    
    plt.tight_layout()
    
    img_path = os.path.join("static", "health_analysis.png")
    plt.savefig(img_path)
    plt.close()
    
    return img_path

@app.route('/', methods=['GET'])
def home():
    try:
        img_path = visualize_health_analysis(mood)
        return render_template('index.html', temp=mood, img_path=img_path)
    except Exception as e:
        print(f"Error: {e}")
        return render_template('index.html', temp="Error Occurred", img_path=None)

if __name__ == '__main__':
    app.run(debug=True, port=5600)

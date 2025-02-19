# Disease Prediction Using Machine Learning

An end-to-end disease prediction system that leverages multiple machine learning models to provide preliminary insights based on user-provided symptoms. This project includes a Jupyter Notebook for training models, a FastAPI backend for serving predictions, and a React frontend for a user-friendly interface.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Model Training & Prediction Notebook](#model-training--prediction-notebook)
  - [FastAPI Backend](#fastapi-backend)
  - [React Frontend](#react-frontend)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Overview

This project demonstrates how to build a disease prediction system using machine learning. It comprises:

- **Data Processing & Model Training:** A Jupyter Notebook (`disease-prediction-using-machine-learning.ipynb`) that downloads the dataset from Kaggle, performs data preprocessing, visualizes the data, trains multiple classifiers (SVM, Naive Bayes, and Random Forest), and saves the trained models.
- **Backend API:** A FastAPI application (`main.py`) that loads the saved models and serves predictions via RESTful endpoints.
- **Frontend UI:** A React application (`symptomChecker.js`) that provides an intuitive interface for users to input their symptoms and view the prediction results.

---

## Features

- **Multi-Model Ensemble:** Combines predictions from SVM, Naive Bayes, and Random Forest using majority voting.
- **Interactive Visualization:** Visual data exploration using matplotlib and seaborn.
- **RESTful API:** Easily accessible endpoints for symptom data and predictions.
- **User-Friendly Frontend:** A React-based interface that allows users to search for symptoms, select them, and get predictions.
- **Modular Design:** Clear separation between data processing, backend API, and frontend UI.

---

## Architecture

1. **Data & Model Training:**  
   - Downloads and extracts a disease prediction dataset from Kaggle.
   - Preprocesses data and trains three different classifiers.
   - Evaluates models using cross-validation and confusion matrices.
   - Saves the trained models and metadata (e.g., symptom index) for later use.

2. **Backend API (FastAPI):**  
   - Loads saved models and metadata.
   - Provides endpoints to list available symptoms and predict diseases based on user input.

3. **Frontend (React):**  
   - Provides a searchable symptom checker interface.
   - Connects with the backend API to display model predictions.
   - Includes navigation for additional information and settings.

---

## Getting Started

### Prerequisites

- **Python 3.7+**
- **Node.js & npm** (for the React frontend)
- **Kaggle API:** Ensure you have a valid `kaggle.json` file for dataset access.
- Recommended Python libraries:
  - `numpy`
  - `pandas`
  - `scikit-learn`
  - `matplotlib`
  - `seaborn`
  - `joblib`
  - `fastapi`
  - `uvicorn`
  - `pydantic`

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/disease-prediction-using-machine-learning.git
   cd disease-prediction-using-machine-learning

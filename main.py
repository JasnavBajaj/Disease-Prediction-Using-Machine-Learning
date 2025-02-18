from fastapi import FastAPI, HTTPException # type: ignore
from pydantic import BaseModel # type: ignore
import joblib # type: ignore
import numpy as np # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore

# Initialize FastAPI app
app = FastAPI()

# Enable CORS to allow React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models and encoders
svm_model = joblib.load("svm_model.pkl")
nb_model = joblib.load("nb_model.pkl")
rf_model = joblib.load("rf_model.pkl")
encoder = joblib.load("encoder.pkl")
data_dict = joblib.load("data_dict.pkl")

# Get available symptoms
SYMPTOM_INDEX = data_dict["symptom_index"]
PREDICTION_CLASSES = data_dict["predictions_classes"]

class SymptomInput(BaseModel):
    symptoms: str

@app.get("/")
def home():
    return {"message": "Disease Prediction API is running!"}

@app.get("/symptoms")
def get_symptoms():
    return list(SYMPTOM_INDEX.keys())

@app.post("/predict")
def predict_disease(input_data: SymptomInput):
    symptoms = input_data.symptoms.split(",")

    # Initialize input array
    input_vector = [0] * len(SYMPTOM_INDEX)

    for symptom in symptoms:
        symptom = symptom.strip().lower()  # Normalize input symptoms
        backend_symptoms = {key.lower(): val for key, val in SYMPTOM_INDEX.items()}  # Normalize backend symptoms
        if symptom in backend_symptoms:
            index = backend_symptoms[symptom]
            input_vector[index] = 1
        else:
            raise HTTPException(status_code=400, detail=f"Symptom '{symptom}' not recognized. Check available symptoms.")

    # Reshape for model prediction
    input_vector = np.array(input_vector).reshape(1, -1)

    # Predict using all models
    rf_pred = PREDICTION_CLASSES[rf_model.predict(input_vector)[0]]
    nb_pred = PREDICTION_CLASSES[nb_model.predict(input_vector)[0]]
    svm_pred = PREDICTION_CLASSES[svm_model.predict(input_vector)[0]]

    # Majority voting
    from statistics import mode
    final_pred = mode([rf_pred, nb_pred, svm_pred])

    return {
        "rf_model_prediction": rf_pred,
        "naive_bayes_prediction": nb_pred,
        "svm_model_prediction": svm_pred,
        "final_prediction": final_pred
    }
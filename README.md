

A web application for symptom checking and finding doctors, built with React (frontend) and Flask (backend).

## Features

- Symptom Checker: Enter symptoms and get predictions.
- Find Doctor: Search for doctors.
- Modern UI with navigation and tooltips.

## Folder Structure

```
Prattek/
├── public/
│   └── backend/
│       └── app.py
├── src/
│   ├── App.tsx
│   ├── components/
│   └── pages/
├── data/
│   └── Training.csv
├── package.json
└── README.md
```

## Getting Started

### 1. Clone the repository

```sh
git clone <your-repo-url>
cd Prattek
```

### 2. Install Frontend Dependencies

```sh
npm install
```

### 3. Start the Frontend

```sh
npm run dev
```
Visit [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Install Backend Dependencies

```sh
pip install flask flask-cors scikit-learn pandas numpy
```

### 5. Prepare Data

Place `Training.csv` inside the `data` folder:
```
Prattek/data/Training.csv
```

### 6. Start the Backend

```sh
python public/backend/app.py
```
Backend runs at [http://localhost:5000](http://localhost:5000).

## Usage

- Use the navigation bar to access Symptom Checker and Find Doctor.
- The frontend communicates with the backend via API calls.

## Troubleshooting

- **FileNotFoundError:** Ensure `Training.csv` exists in the `data` folder.
- **Port Issues:** Make sure ports 5173 (frontend) and 5000 (backend) are free.

## License

MIT

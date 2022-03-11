# React Exercise

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## About

Exercise was designed for Angular but I managed to utilize knowledge of React and React-Routing to build it out using those technologies.
Project aimed to allow visualization of data regarding blood pressure indexes of three countries as well as some multi-layer data filtering.

### Structure

User can navigate to data visualizaion component which is rendered differently depending on the activated route. Data is displayed only for chosen countries and can be filtered to display data for specific gender, with or without median values and with the focus of comparing gender values. Another way of filtering is with the usage of range slider ([react-range](https://codesandbox.io/s/ifypr?file=/src/App.js)) with two thumbs and it is incorporated as a global component. Visualization is done using [Highcharts](https://www.highcharts.com/demo/column-basic).

### Appereance

General style of the app is designed in the manner of neumorphism.

## Setup

I've decided to setup a server for communicating with data provider, in this case [WHO](https://www.who.int/data/gho/info/gho-odata-api). To avoid CORS policy restrictions, I've set up a mini backend that will fetch me the data.

### Backend Setup

Backend is run using `npm run start` in the directory named "back" in the root.
It uses express, axios, cors and nodemon packages for setting up a server.

### Frontend

Frontend is run using `npm start` in the directory named "front" in the root.

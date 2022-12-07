import express from 'express';
const configViewEngine = (app) => {
    app.use(express.static('public'));
};

export default configViewEngine;

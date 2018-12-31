require('../node_modules/bootstrap/dist/css/bootstrap.min.css')

/*document.body.innerHTML = `
    <div class="container">
    <h1>FOca Application</h1>
    <div class="b4-main"></div>
    <div class="container"></div>
    <div class="b4-alerts"></div>
    </div>
`;*/

/*
const mainElement = document.body.querySelector('.b4-main');

mainElement.innerHTML = `
    <div class="jumbotron">
    <h1>Welcome!</h1>
    <p>Foca is an application about football.</p>
    </div>
`;

const alertsElement = document.body.querySelector('.b4-alerts');

alertsElement.innerHTML = `
    <div class="alert alert-success" role="alert">
        <strong>Success!</strong> Bootstrap is working.
    </div>
`;
*/

const mainContent = document.body.querySelector('#mainContent');

mainContent.innerHTML = `<h1>Este é o body (mainContent)</h1>`;
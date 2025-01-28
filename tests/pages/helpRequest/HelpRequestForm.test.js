import React from "react";
import { MemoryRouter } from "react-router";
import { Provider } from "react-redux";
import { createStore } from "redux";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import HelpRequestForm from "../../../src/pages/HelpRequest/HelpRequestForm";

test("it renders and checks divs with mt-3 class, the parent divs", () => {
  /*
  const store = createStore((state = {
                                 auth: {
                                   idToken: 'mockIdToken',
                                 },
                                 request: {
                                   categories: 'categories',
                                 }
                               }
    ) => state);

    global.fetch = jest.fn(() => Promise.reject(null));

<<<<<<< HEAD
import axios from '../__mocks__/axios'
import { submitData } from './axiosFetch'
=======
    render(
      <MemoryRouter>
        <Provider store={store}>
          <HelpRequestForm/>
        </Provider>
      </MemoryRouter>
    )

    const dropdown = screen.getByTestId('dropdown');
    fireEvent.change(dropdown, {target: {value: 'no'}});
>>>>>>> 9db9d865fedf67c042b78acba2055a2e1d159ed2

// Inicializa la store solo una vez antes de los tests/*
/*let store;

<<<<<<< HEAD
beforeAll(() => {
  store = configureStore({
    reducer: {
      request: requestReducer,
      auth: authReducer,
    },
    preloadedState: {
      request: {
        categories: [{ name: 'General' }],
      },
      auth: {
        idToken: 'test-token',
      },
    },
    middleware: [thunk],
  });
  fetchMock.resetMocks(); // Reseteamos mocks antes de cada prueba
});
*/

jest.mock('axios')

test('it renders and checks divs with mt-3 class, the parent divs in form',async () => {
  await render(
    <Provider store={store}>
      <HelpRequestForm />
    </Provider>
  );

  const divs = [
    screen.getByTestId('parentDivOne'),
    screen.getByTestId('parentDivTwo'),
    screen.getByTestId('parentDivThree'),
    screen.getByTestId('parentDivFour'),
    screen.getByTestId('parentDivFive'),
    screen.getByTestId('parentDivSix'),
    screen.getByTestId('parentDivSeven')
  ];

  divs.forEach((div) => {
    expect(div).toHaveClass('mt-3');
  });
});
 
test('checks handle submit',async() =>{
  axios.post.mockResolvedValue({data:{succes:true, id : 12345}})

  const formData = {
    is_self: "yes",                 // Para el selector "For Self" (yes/no)
    requester_first_name: "John",    // Nombre del solicitante
    requester_last_name: "Doe",      // Apellido del solicitante
    email: "john.doe@example.com",   // Correo electrónico del solicitante
    phone: "123-456-7890",           // Número de teléfono
    age: "35",                       // Edad
    gender: "Male",                  // Género (por ejemplo, Male, Female, etc.)
    preferred_language: "English",   // Idioma preferido
    category: "General",             // Categoría de la solicitud
    request_type: "remote",          // Tipo de solicitud (Remote o In Person)
    location: "New York, NY",        // Ubicación, solo si es "In Person"
    subject: "Help with groceries",  // Asunto de la solicitud
    description: "I need help with grocery shopping.",  // Descripción de la solicitud
  };

  const upload = await submitData(formData)

  


  expect(upload).toEqual({succes:true, id : 12345})


})
/*test('submits the form successfully', async () => {
  // Simulamos una respuesta exitosa de fetch
  fetchMock.mockResponseOnce(JSON.stringify({ requestId: '12345' }));

  // Renderizamos el componente envuelto en el Provider de Redux
  render(
    <Provider store={store}>
      <HelpRequestForm />
    </Provider>
  );

  // Llenamos los campos de texto del formulario
  fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
  fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });

  // Simulamos el envío del formulario
  fireEvent.submit(screen.getByRole('button', { name: /submit/i }));

  // Esperamos a que fetch sea llamado
  await waitFor(() => expect(fetch).toHaveBeenCalled());

  // Verificamos que fetch fue llamado con los parámetros correctos
  expect(fetch).toHaveBeenCalledWith(
    'https://a9g3p46u59.execute-api.us-east-1.amazonaws.com/saayam/dev/requests/v0.0.1/help-request',
    expect.objectContaining({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-token',
      },
      body: JSON.stringify({
        requester_first_name: 'John',
        requester_last_name: 'Doe',
        email: 'john@example.com',
      }),
    })
  );

  // Verificamos que se muestra la alerta de éxito
  await waitFor(() =>
    expect(screen.getByText(/Request submitted successfully! Request ID: 12345/)).toBeInTheDocument()
  );
});

test('shows an error when the submission fails', async () => {
  // Simulamos una respuesta fallida de fetch
  fetchMock.mockReject(new Error('Failed to submit request'));

  render(
    <Provider store={store}>
      <HelpRequestForm />
    </Provider>
  );

  // Llenamos los campos de texto del formulario
  fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
  fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });

  // Simulamos el envío del formulario
  fireEvent.submit(screen.getByRole('button', { name: /submit/i }));

  // Esperamos a que fetch sea llamado y falle
  await waitFor(() => expect(fetch).toHaveBeenCalled());

  // Verificamos que se muestra la alerta de error
  await waitFor(() =>
    expect(screen.getByText(/Failed to submit request!/)).toBeInTheDocument()
  );
});
*/
=======
    const divs = [firstParentDiv, secondParentDiv, thirdParentDiv, fourthParentDiv, fifthParentDiv, sixthParentDiv, seventhDiv]

    divs.forEach((div) => {
      expect(div).toHaveClass('mt-3')
    })
    */
});
>>>>>>> 9db9d865fedf67c042b78acba2055a2e1d159ed2

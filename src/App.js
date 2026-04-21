import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./App.css";

const App = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    level: "",
    dueDate: ""
  });

  const handleNext = () => {
    if (
      (step === 1 && formData.email) ||
      (step === 2 && formData.name) ||
      (step === 3 && formData.level) ||
      (step === 4 && formData.dueDate)
    ) {
      setStep(step + 1);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  async function createContact({ nome, email, nivelIngles, diaVencimento }) {


    const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer pat-na1-58f8836b-43fc-4db0-abbf-3cc89f3d64be`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: {
          firstname: nome,
          email: email,
          nivel_de_ingles: nivelIngles,      // propriedade personalizada
          dia_de_vencimento: diaVencimento   // propriedade personalizada (formato YYYY-MM-DD se for date)
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erro ${response.status}: ${error}`);
    }

    return await response.json();
  }

  const handleFinish = async () => {
  try {
    setLoading(true);

    await createContact({
      nome: formData.name,
      email: formData.email,
      nivelIngles: formData.level,
      diaVencimento: formData.dueDate
    });

    setStep(5);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  return (
    <main className="layout">
      <header className="top-bar">
        <h1>Bla Bla Bla English</h1>
      </header>

      <section className="content">
        <div className="left-panel">
          <h2>Comece sua jornada no inglês 🚀</h2>
          <p>Responda algumas perguntas rápidas para personalizarmos sua experiência.</p>
        </div>

        <div className="form-container">
          <div className="form-box">

            {/* STEP 1 */}
            {step === 1 && (
              <div className="step">
                <h2>Digite seu Email</h2>
                <input
                  type="email"
                  name="email"
                  placeholder="seuemail@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                <button onClick={handleNext}>Avançar</button>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="step">
                <h2>Digite seu Nome</h2>
                <input
                  type="text"
                  name="name"
                  placeholder="Seu nome completo"
                  value={formData.name}
                  onChange={handleChange}
                />
                <button onClick={handleNext}>Avançar</button>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="step">
                <h2>Qual seu nível de inglês?</h2>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                >
                  <option value="">Selecione</option>
                  <option value="Iniciante">Iniciante</option>
                  <option value="Intermediário">Intermediário</option>
                  <option value="Avançado">Avançado</option>
                </select>
                <button onClick={handleNext}>Avançar</button>
              </div>
            )}

            {/* STEP 4 - NOVO */}
            {step === 4 && (
              <div className="step">
                <h2>Qual o dia de vencimento da sua fatura?</h2>
                <input
                  type="number"
                  name="dueDate"
                  placeholder="Ex: 10"
                  min="1"
                  max="31"
                  value={formData.dueDate}
                  onChange={handleChange}
                />
                <button
  onClick={handleFinish}
  disabled={loading}
>
  {loading ? "Enviando..." : "Finalizar"}
</button>
              </div>
            )}

            {/* STEP 5 - FINAL */}
            {step === 5 && (
              <div className="step">
                <h2>Cadastro Concluído 🎉</h2>
                <p>Obrigado por se cadastrar!</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Nome:</strong> {formData.name}</p>
                <p><strong>Nível:</strong> {formData.level}</p>
                <p><strong>Vencimento:</strong> Dia {formData.dueDate}</p>
              </div>
            )}

          </div>
        </div>
      </section>
    </main>
  );
};

export default App
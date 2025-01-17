import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [acoes, setAcoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const apiKey = 'cu5533hr01qijc7409d0cu5533hr01qijc7409dg';

  // Buscar símbolos das ações
  useEffect(() => {
    const fetchSymbols = async () => {
      const endpoint = `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${apiKey}`;

      try {
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error('Falha ao buscar dados');
        }
        const result = await response.json();
        const topSymbols = result.slice(0, 5); // Limita a 5 ações

        // Buscar cotações para as ações selecionadas
        const quotes = await Promise.all(
          topSymbols.map(async (acao) => {
            const quoteEndpoint = `https://finnhub.io/api/v1/quote?symbol=${acao.displaySymbol}&token=${apiKey}`;
            const quoteResponse = await fetch(quoteEndpoint);
            const quoteData = await quoteResponse.json();
            return {
              ...acao,
              currentPrice: quoteData.c,
            };
          })
        );

        setAcoes(quotes);
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    };

    fetchSymbols();
  }, []);

  return (
    <div className="app">
      <header>
        <h1>Mercado de Ações</h1>
      </header>
      <main>
        {carregando && <p>Carregando...</p>}
        {erro && <p>Erro: {erro}</p>}
        {acoes.length > 0 ? (
          <div className="stocks">
            {acoes.map((acao, index) => (
              <div key={index} className="stock-card">
                <h2>{acao.displaySymbol}</h2>
                <p><strong>Nome:</strong> {acao.description}</p>
                <p><strong>Bolsa:</strong> {acao.exchange}</p>
                <p><strong>Preço Atual:</strong> ${acao.currentPrice}</p>
              </div>
            ))}
          </div>
        ) : (
          !carregando && <p>Não há dados disponíveis.</p>
        )}
      </main>
      <footer>
        <p>Fornecido por <a href="https://finnhub.io" target="_blank" rel="noopener noreferrer">Finnhub API</a></p>
      </footer>
    </div>
  );
}

export default App;

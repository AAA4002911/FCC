import { useState } from "react";
import "./App.css";
import quotes_database from "./quotes";

function App() {
    const random_quote = () => {
        let size = quotes_database.length;
        let random_index = parseInt(Math.random() * size);
        let result = quotes_database[random_index];
        let textTolink = quotes_database[random_index].text
            .split(" ")
            .join("%20")
            .split("@")
            .join("%40")
            .split("!")
            .join("%21");
        let link = "https://twitter.com/intent/tweet?text=" + textTolink;
        result["tweet"] = link;
        return result;
    };

    const [quote, setQuote] = useState(random_quote());

    return (
        <div className="App">
            <div id="quote-box">
                <p id="text">{quote.text}</p>
                <p id="author">{quote.source}</p>
                <button>
                    <a id="tweet-quote" href={`${quote.tweet}`} Target="_blank">
                        twitter
                    </a>
                </button>
                <button id="new-quote" onClick={() => setQuote(random_quote())}>
                    New quote
                </button>
            </div>
        </div>
    );
}

export default App;

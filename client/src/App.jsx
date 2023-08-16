import "./App.css";
import img1 from "/src/img1.png";
import { useState, useEffect } from "react";
import axios from "axios";
import { FiLink } from "react-icons/fi";
import { useDebouncedCallback } from "use-debounce";

function App() {
  const [text, setText] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState("");
  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const debounced = useDebouncedCallback(async () => {
    try {
      setIsLoading("loading");
      const results = await axios.get(
        `http://localhost:4001/trips?keywords=${text}`
      );
      setIsLoading("success");
      setData(results.data.data);

      console.log(results);
    } catch {
      console.log("fetching error");
      setIsLoading("error");
    }
  }, 500);

  useEffect(() => {
    debounced();
  }, [text]);

  const handlerSearch = (tag) => {
    let newText = text;
    if (text === "") {
      setText(`${tag}`);
    } else {
      setText("");
      setText(newText + ` ${tag}`);
    }
  };

  const handlerClick = () => {
    setIsVisible(true);
  };

  setTimeout(() => {
    setIsVisible(false);
  }, 1200);

  return (
    <div className="App">
      {isVisible && <h3 className="link-message">Link Copied!</h3>}
      <section className="header">
        <h1>เที่ยวไหนดี</h1>
      </section>
      <div className="input-search">
        <label htmlFor="search travel">ค้นหาที่เที่ยว</label>
        <input
          type="text"
          placeholder="หาที่เที่ยวแล้วไปกัน"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
        <section className="main">
          {isLoading === "loading" && <h1>Data Loading...</h1>}
          {isLoading === "error" && <h1>Fail To Load Data</h1>}
          {isLoading === "success" && null}

          {data.map((item, index) => {
            return (
              <>
                <div className="posts" key={index}>
                  <div className="img-main">
                    <img id="img-main" src={item.photos[0]} />
                  </div>
                  <div className="details">
                    <h2>
                      <a href={item.url}>{item.title}</a>
                    </h2>
                    <p>{item.description.substring(0, 100)}</p>
                    <a href={item.url}>อ่านต่อ</a>

                    <div className="tags">
                      <p>หมวด</p>
                      {item.tags.map((tag, index) => {
                        return (
                          <>
                            <h4 key={index} onClick={() => handlerSearch(tag)}>
                              {tag}
                            </h4>
                          </>
                        );
                      })}
                    </div>
                    <div className="img-small">
                      {item.photos.map((photo, index) => {
                        return <img id="img" src={photo} />;
                      })}
                    </div>
                  </div>

                  <FiLink
                    id="link-icons"
                    onClick={() => {
                      navigator.clipboard.writeText(item.url);
                      handlerClick();
                    }}
                  />
                </div>
              </>
            );
          })}
        </section>
      </div>
    </div>
  );
}

export default App;

function Key({ data, setDisplay }) {
    const clickHandle = (data) => {
        setDisplay(data.source.split("/")[2]);
        let audio = document.getElementById(data.key_name);
        audio.play();
    };

    return (
        <div className="drum-pad" id={data.id} onClick={() => clickHandle(data)}>
            <audio id={data.key_name} src={data.source} className="clip"></audio>
            {data.key_name}
        </div>
    );
}

export default Key;

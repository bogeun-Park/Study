export default function DisplayNumber(porps) {
    return (
        <div>
            <h1>Display Number</h1>
            <input type="text" value={porps.number} readOnly /> {porps.unit} {porps.test}
        </div>
    );
}

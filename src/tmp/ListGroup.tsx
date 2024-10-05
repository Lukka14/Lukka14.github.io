export function ListGroup() {
  let items = ["Tokye", "San Diego", "Bali"];
  items = [];

  
  return (
    <>
      <h1>List</h1>
      <ul className="list-group">
        {items.map((item) => (
          <li key={item} className="list-group-item">
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

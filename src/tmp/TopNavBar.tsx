import "../css/App.css";

function LeftNavBar() {
  return (
    <div className="container text-center">
      <div className="row row-cols-auto">
        <div className="col">Column</div>
        <div className="col">Column</div>
        <div className="col">Column</div>
        <div className="col">Column</div>
      </div>
      <div className="movieList"></div>
    </div>
  );
}

function TopNavBar() {
  return (
    <div className="topNavBar">
      <div className="topNavBarContainer">
        <LeftNavBar></LeftNavBar>
      </div>
    </div>
  );
}


export default TopNavBar;

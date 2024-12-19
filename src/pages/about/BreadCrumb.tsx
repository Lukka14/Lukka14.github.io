import Breadcrumb from 'react-bootstrap/Breadcrumb';

function BreadcrumbComponent() {
  return (
    <Breadcrumb style={{marginTop: '20px', marginLeft: '50px'}}>
      <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
      <Breadcrumb.Item active>Help</Breadcrumb.Item>
    </Breadcrumb>
  );
}

export default BreadcrumbComponent;
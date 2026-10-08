import ShapeGrid from './ShapeGrid.jsx'

// moving hexagon background (not on landing)
function PageBackground() {
  return (
    <div className="shared-page-background" aria-hidden="true">
      <ShapeGrid shape="hexagon" direction="diagonal" speed={0.12} squareSize={80} borderColor="rgba(57, 81, 22, 0.55)" />
    </div>
  )
}

export default PageBackground

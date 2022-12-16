import React from 'react'

function Aggregation({categoryItems,aggregating}) {
    const items=categoryItems;
    // const aggregating = (e) => {
    //   const { name, checked } = e.target;
    //   let temp = categoryItems?.map((elem) =>
    //     elem.name === name ? { ...elem, isChecked: checked } : elem
    //   );
    //   //setCategoryItems(temp);//making checkbox slower
    //   console.log(`render The ${name} selected is ${checked}`);
    // };
  return (
    <div style={{ height: '100%'}}>
    <div className="list-checkbox">
      <input
        onChange={(e) => {
          aggregating(e);
        }}
        name="all select"
        value="all select"
        // checked={
        //   items &&
        //   items.filter((elem) => elem?.isChecked !== true).length < 1
        // }
        style={{ marginBottom: '20px' }}
        type="checkbox"
      />
      <span style={{fontSize:'16px',color:'#1161AB',fontWeight:'700'}}>All Select</span>
      <br />
      {items &&
        items.map((elem, index) => {
          return (
            <div key={index}>
              <input
                onChange={(e) => {
                  aggregating(e);
                }}
                key={index}
                name={elem.name}
                value={elem.name}
                // checked={elem?.isChecked || false}
                style={{ marginBottom: '20px' }}
                type="checkbox"
              />
              <span style={{fontSize:'16px',color:'#1161AB',fontWeight:'700',textTransform:'uppercase'}}>{elem.name}</span>
              <br />
            </div>
          );
        })}
    </div>
  </div>
  )
}
export default Aggregation;
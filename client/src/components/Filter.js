import React from 'react';

function Filter({ filterItems, categoryItems }) {
  const items=categoryItems;
  return (
    <div style={{ height: '100%',width:'max-content'}}>
      <div className="list-checkbox">
        <p style={{fontSize:'18px',color:'#1161AB',fontWeight:'700',textDecoration:'underline'}}>Count sites loaded</p>
        <input
          onChange={(e) => {
            // add to list
            filterItems(e);
          }}
          name="all select"
          value="all select"
          checked={
            categoryItems &&
            categoryItems.filter((elem) => elem?.isChecked !== true).length < 1
          }
          style={{ marginBottom: '20px' }}
          type="checkbox"
        />
        <span style={{fontSize:'18px',color:'#1161AB',fontWeight:'600'}}>All Select</span>
        <br />
        {items &&
          items.map((elem, index) => {
            return (
              <div key={index}>
                <input
                  onChange={(e) => {
                    // add to list
                    filterItems(e);
                  }}
                  key={index}
                  name={elem.name}
                  value={elem.name}
                  checked={elem?.isChecked || false}
                  style={{ marginBottom: '20px' }}
                  type="checkbox"
                />
                <span style={{fontSize:'18px',color:'#1161AB',fontWeight:'600',textTransform:'uppercase'}}>{elem.name}</span>
                <br />
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Filter;

import { Dropdown } from "@nextui-org/react";


function TierDropDown({tierNumber}) {

  const tiersArray = []

  for(let i = 0; i < tierNumber+1; i++){
    tiersArray[i] = i+1;
  }

  return (
    <Dropdown color="secondary">
      <Dropdown.Button flat>SELECT TIER</Dropdown.Button>
      <Dropdown.Menu aria-label="Static Actions">
        {
          tiersArray.map(tierId => {
            return (
              <Dropdown.Item><p>Tier {tierId}</p></Dropdown.Item>
            );
          })
        }
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default TierDropDown;
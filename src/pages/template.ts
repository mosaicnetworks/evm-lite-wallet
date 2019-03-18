const mycontracttemplate =
	'\n\
contract ui_contract_name {\n\
    bytes32 ui_string1_name = "ui_string1_value";\n\
    function ui_function1_name(bytes32 value) {\n\
        ui_string1_name = value;\n\
    }\n\
}';

export default mycontracttemplate;

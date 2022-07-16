var ola = 1;

var teste = {
    "1": {
        "id_client": "1",
        "points": "2220",
        "obj": {
            "1": {
                "valor": 2
            }
        }
    }
}

var teste2 = {
    ...teste[1],
    "obj": {
        ...teste.obj,
        "2": {
            "valor": 2
        }
    }
}


console.log(teste2)
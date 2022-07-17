import axios from 'axios';
import { response } from 'express';
export default new class RewardsController {
    // var client = {
    //     id_client: {
    //         id_client,
    //         "points": orderValue,
    //         "orders": {
    //             OrderId: {
    //                 orderValue,
    //                 "operation": "credit"
    //             }
    //         }
    //     }
    // }; // estrutura do cliente

    async index(req, res) { //get número de pontos
        let { id_client } = req.params; //captura o numero do cliente pelo query da requisição
        let masterDataDocumentResponse =
            await axios.get(`https://${process.env.ACCOUNT_NAME}.${process.env.ENVIROMENT}.com/api/dataentities/${process.env.DATA_ENTITY_NAME}/documents/${process.env.MASTERDATA_DOCUMENT_ID}?_fields=${id_client}`,
                {headers:{"X-VTEX-API-AppKey": process.env.X_VTEX_API_AppKey, "X-VTEX-API-AppToken": process.env.X_VTEX_API_AppToken}});
        let points = await masterDataDocumentResponse.data[id_client].points; // puxar os pontos do banco de dados pelo número do cliente
        return res.status(201).json({ "points": points }); // retorna o número de pontos do cliente
    }

    async store(req, res) { //post altera número de pontos
        let { OrderId, State, hookConfig } = req.body; // captura as variaveis número do pedido, estado do pedido e configuração
        if (hookConfig) //se possuir a variavel configuração, significa que o request foi somente de configuração
            return res.status(200).json({ "Config": "Successful" }); //retorna um status 200 para informar que a configuração foi bem sucedida

        if (!State) //verifica se a váriavel estado foi passada no body da requisição
            return res.status(400).error({ "error": "Bad Request" }); //envia um erro informando requisição inválida
        else if (State === "payment-approved") { //verifica se o estado do pedido é de pagamento aprovado 
            let orderResponse = await axios.get(`https://${process.env.ACCOUNT_NAME}.${process.env.ENVIROMENT}.com/api/oms/pvt/orders/${OrderId}`,
                {headers:{"X-VTEX-API-AppKey": process.env.X_VTEX_API_AppKey, "X-VTEX-API-AppToken": process.env.X_VTEX_API_AppToken}}); //getOrderById captura informação do pedido pelo número do pedido
            
            let id_client = await orderResponse.data.clientProfileData.userProfileId; //captura o número do cliente pelo pedido
            let orderValue = await orderResponse.data.value; // valor total do pedido
            let totalOrderItemsValue = await orderResponse.data.totals[0].value; //valor total dos itens do pedido
            let orderValueWithoutShip = totalOrderItemsValue + (await orderResponse.data.totals[1].value); //valor total dos pontos (deduzindo o desconto)
            let points = ((orderValueWithoutShip/100)+"").split(".")[0]; //Logica para eliminar os centavos

            //get no documento do masterdata
            let masterDataDocumentResponse =
                await axios.get(`https://${process.env.ACCOUNT_NAME}.${process.env.ENVIROMENT}.com/api/dataentities/${process.env.DATA_ENTITY_NAME}/documents/${process.env.MASTERDATA_DOCUMENT_ID}?_fields=${id_client}`,
                {headers:{"X-VTEX-API-AppKey": process.env.X_VTEX_API_AppKey, "X-VTEX-API-AppToken": process.env.X_VTEX_API_AppToken}});

             if (!masterDataDocumentResponse.data[id_client]) { // se for a primeira compra do usuario
                let responseUpdate = await axios.patch(`https://${process.env.ACCOUNT_NAME}.${process.env.ENVIROMENT}.com/api/dataentities/${process.env.DATA_ENTITY_NAME}/documents/${process.env.MASTERDATA_DOCUMENT_ID}`, {
                    [id_client]: {
                        id_client,
                        points,
                        "orders": {
                            [OrderId]: {
                                orderValue,
                                "operation": "credit"
                            }
                        }
                    }
                },{headers:{"X-VTEX-API-AppKey": process.env.X_VTEX_API_AppKey, "X-VTEX-API-AppToken": process.env.X_VTEX_API_AppToken}});

                res.status(responseUpdate.status).json({"Response":"Ok - User's First Order"});
             } else { //se o usuario já tiver comprado anteriormente
                if(!masterDataDocumentResponse.data[id_client].orders[OrderId]){
                    let responseUpdate = await axios.patch(`https://${process.env.ACCOUNT_NAME}.${process.env.ENVIROMENT}.com/api/dataentities/${process.env.DATA_ENTITY_NAME}/documents/${process.env.MASTERDATA_DOCUMENT_ID}`, 
                    {
                        [id_client]: {
                            ...masterDataDocumentResponse.data[id_client],
                            "points": +points + +masterDataDocumentResponse.data[id_client].points,
                            "orders": {
                                ...masterDataDocumentResponse.data[id_client].orders,
                                [OrderId]: {
                                    orderValue,
                                    "operation": "credit"
                                }
                            }
                        }
                    },
                    {
                        headers:{"X-VTEX-API-AppKey": process.env.X_VTEX_API_AppKey, "X-VTEX-API-AppToken": process.env.X_VTEX_API_AppToken}
                    });
                    res.status(responseUpdate.status).json({"Response":"Ok - User's Orders Updated"});
                }
                res.status(400).json({"error": "The Order is already accounted on user's points"});
             }
         } else if (State === "canceled") { //verifica se o estado do pedido é cancelado
             //logica para debitar
         }

        //caso o estado da requisição seja outro, ele não alterará o número de pontos do cliente
        return res.status(100).json({ "Info": "Only aproved or canceled Orders change the user's points." })

    }
}
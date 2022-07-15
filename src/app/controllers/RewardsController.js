import axios from 'axios';
export default new class RewardsController {

    async index(req, res) { //get número de pontos
        let { id_client } = req.params; //captura o numero do cliente pelo query da requisição
        let points; // puxar os pontos do banco de dados pelo número do cliente

        return res.status(201).json({ "points": points }); // retorna o número de pontos do cliente
    }

    async store(req, res) { //post altera número de pontos
        let { OrderId, State, config } = req.body; // captura as variaveis número do pedido, estado do pedido e configuração

        if (config) //se possuir a variavel configuração, significa que o request foi somente de configuração
            return res.status(200).json({ "Config": "Successful" }); //retorna um status 200 para informar que a configuração foi bem sucedida

        if(!State) //verifica se a váriavel estado foi passada no body da requisição
            return res.status(400).error({"error": "Bad Request"}); //envia um erro informando requisição inválida

        else if (State === "payment-approved") { //verifica se o estado do pedido é de pagamento aprovado 
            let response = await axios.get(`https://travellog.myvtex.com.br/api/oms/pvt/orders/${OrderId}`); //getOrderById captura informação do pedido pelo número do pedido
            let id_client = await response.data.clientProfileData.userProfileId; //captura o número do cliente pelo pedido

            //logica para creditar
        } else if (State === "canceled") { //verifica se o estado do pedido é cancelado
            //logica para debitar
        }

        //caso o estado da requisição seja outro, ele não alterará o número de pontos do cliente
        return res.status(100).json({ "Info": "Only aproved or canceled Orders change the user's points." })

    }
}
export default {
    select: {
        situation: [
            { value: "p", name: "pendente" },
            { value: "r", name: "resolvido" },
        ],
        type_solicitations: [
            { value: "delivery_immobile", name: "entrega imóvel" },
            { value: "negotiation", name: "negociação aluguel" },
            { value: "other", name: "outros" }
        ]
    }
}
function Order() {
    this.orderDate = "";
    this.orderItems = [];
    this.delivery = {
        deliveryContact: "",
        deliveryAdress: "",
        deliveryPhone: null,
        deliveryCost: null,
    };
}
Order.prototype.orderSummary = function () {
    let orderItemsTotal = 0;
    if (this.orderItems.length > 0) {
        this.orderItems.forEach((item) => {
            orderItemsTotal += item.orderItemCost();
        });
    }

    let deliveryCost = validAddress() ? 200 : 0
    let orderTotal = orderItemsTotal + deliveryCost;

    let deliveryAdress = "";
    if (!(this.delivery.deliveryPhone === null)) {
        deliveryAdress = `To: ${this.delivery.deliveryContact} Phone: ${this.delivery.deliveryPhone} Address: ${this.delivery.deliveryAdress}`;
    }
    return {
        itemsTotal: orderItemsTotal,
        deliveryCost: deliveryCost,
        orderTotal: orderTotal,
        deliveryAdress: deliveryAdress,
    };
};
function OrderItem(size, crust, toppings, quantity = 1) {
    this.size = size;
    this.crust = crust;
    this.toppings = toppings;
    this.quantity = quantity;
}
OrderItem.prototype.orderItemCost = function () {
    var costFactor = 1;
    if (this.size === "medium") {
        costFactor = 1.5;
    } else if (this.size === "large") {
        costFactor = 1.8;
    }

    var crustCost = this.crust
        ? crusts.find((crust) => crust.name === this.crust).cost
        : 0;
    var toppingsCost = 0;
    if (this.toppings) {
        this.toppings.forEach((e) => {
            let cost = toppings.find((topping) => topping.name === e).cost;
            toppingsCost += cost;
        });
    }

    return (crustCost + toppingsCost) * costFactor * this.quantity;
};
var crusts = [
    { name: "crispy", cost: 200 },
    { name: "stuffed", cost: 200 },
    { name: "gluten-free", cost: 200 },
];

var toppings = [
    { name: "chicken", cost: 300 },
    { name: "mushroom", cost: 300 },
    { name: "cucumber", cost: 300 },
    { name: "tomato", cost: 300 },
    { name: "sausage", cost: 300 },
];
function showOrderSummary(order) {
    $("#orders-cost").val(order.orderSummary().itemsTotal);
    $("#delivery-cost").val(order.orderSummary().deliveryCost);
    $("#total-cost").val(order.orderSummary().orderTotal);
}

function createTableRow(data) {
    $("tbody").append(
        ` <tr>
                    <th scope="row">$</th>
                    <td><button class="remove btn">remove</button></td>
                    <td>
                        Pizza ${data.crust}
                        ${data.size},Topping:[${data.toppings.join(", ")}]
                    </td>
                    <td><input class="qty" type="number" min="1" value="${
                        data.quantity
                    }" /></td>
                    <td class="cost">${data.orderItemCost()}</td>
                </tr>
            `
    );
}
function validAddress() {
    
    if ($("#delivery-address").val().length > 0 && $("#delivery-phone").val().length > 0 && $("#delivery-name").val().length) {
        return true
    } else {
        return false
    }
}
$(document).ready(function () {
    var crustInput = $("#form-order .input[name=crust]");
    var quantityInput = $("#form-order .input[name=order-qty]");
    var priceDispay = $("#price");
    const order = new Order();
    const orderItems = order.orderItems;
    let activeItem;
    $("#form-order .input").on("change", function () {
        var toppings = [];        

        $("#form-order .input[name=topping]:checked").each(function () {
            let topping = $(this).val()
            toppings.push(topping)
        });

        var orderQty = parseInt(quantityInput.val());
        var sizeInput = $("#form-order .input[name=size]:checked").val();
        const changedItem = new OrderItem(
            sizeInput,
            crustInput.val(),
            toppings,
            orderQty
        );
        priceDispay.val(changedItem.orderItemCost());
        activeItem = changedItem;
    });
        $("#add-to-cart").click(function (e) {
        e.preventDefault();
        orderItems.push(activeItem);
        showOrderSummary(order);
        createTableRow(activeItem);
        const removeRowButton = $("tbody tr").last().find(".btn.remove");
        const itemQty = $("tbody tr").last().find(".qty");
        const itemCost = $("tbody tr").last().find(".cost");
        removeRowButton.click(function () {
            let rowIndex = $(this).parents("tr").index();
            $("tbody tr").get(rowIndex).remove();
            orderItems.splice(rowIndex, 1);
            showOrderSummary(order);
        });
        let unitCost = parseInt(itemCost.text()) / parseInt(itemQty.val());
        itemQty.on("change", function () {
            let cost = unitCost * parseInt($(this).val());
            itemCost.text(cost);
            let rowIndex = $(this).parents("tr").index();
            orderItems[rowIndex].quantity = parseInt($(this).val());
            showOrderSummary(order);
        });
    });
    $(".address").on('change', function () {
        if (validAddress()) {
            showOrderSummary(order);
       }
    })
    $("#submit-order").click(function () {

        if (validAddress()) {
            alert(`
            Thanks for Ordering from our store. Your order will be delivered to your  address
            `)

            location.reload()
        } else {
            alert(`
            You have not provided shipping Address
            Your order cannot be saved`)
        }



    })
});

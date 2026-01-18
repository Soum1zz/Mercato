package com.sou.eCom.controller;

import com.sou.eCom.model.dto.OrderRequest;
import com.sou.eCom.model.dto.OrderResponse;
import com.sou.eCom.security.UserPrincipal;
import com.sou.eCom.service.CartService;
import com.sou.eCom.service.OrderService;
import com.sou.eCom.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:5173")
public class OrderController {
    @Autowired
    private OrderService service;
    @Autowired
    private CartService cartService;
    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        List<OrderResponse> orderResponseList=service.getAllOrderResponses();
        return new ResponseEntity<>(orderResponseList, HttpStatus.OK);
    }
    @PostMapping("/me/orders")
    public ResponseEntity<OrderResponse> placeOrder(@AuthenticationPrincipal UserPrincipal principal, @RequestBody OrderRequest req){
        OrderResponse orderResponse =service.placeOrder(principal.getUser().getUserId() ,req);
        return new ResponseEntity<>(orderResponse, HttpStatus.CREATED);
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable("orderId") Long orderId){
        return  new ResponseEntity<>(service.getOrderById(orderId),HttpStatus.OK);
    }
    @DeleteMapping("/orders/{orderId}")
    public ResponseEntity<OrderResponse> deleteOrderById(@PathVariable("orderId") Long orderId){

        try{
            service.deleteOrder(orderId);
            return new ResponseEntity<>(HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }


}

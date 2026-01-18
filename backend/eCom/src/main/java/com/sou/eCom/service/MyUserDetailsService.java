package com.sou.eCom.service;


import com.sou.eCom.model.User;
import com.sou.eCom.repo.UserRepo;
import com.sou.eCom.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepo repo;
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user= repo.findByEmail(email).orElseThrow(()->new UsernameNotFoundException("User not found"));

        return new UserPrincipal(user);
    }
}

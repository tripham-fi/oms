package fi.haagahelia.oms.service;

import fi.haagahelia.oms.domain.User;
import fi.haagahelia.oms.repository.UserRepository;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
public class UserDetailServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;

    public UserDetailServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User curruser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));


        return new org.springframework.security.core.userdetails.User(
                curruser.getUsername(),
                curruser.getPassword(),
                curruser.isEnabled(),
                true, true, true,
                AuthorityUtils.createAuthorityList("ROLE_" + curruser.getRole()));
    }
}

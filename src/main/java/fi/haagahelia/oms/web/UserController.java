package fi.haagahelia.oms.web;

import fi.haagahelia.oms.domain.User;
import fi.haagahelia.oms.dto.RegisterDto;
import fi.haagahelia.oms.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public String showLoginPage() {

        if (isUserLoggedIn()) {
            return "redirect:/profile";
        }
        return "login";
    }

    @RequestMapping(value = "/register", method = RequestMethod.GET)
    public String showRegisterPage(Model model) {
        if (isUserLoggedIn()) {
            return "redirect:/profile";
        }

        model.addAttribute("registerDto", new RegisterDto());
        return "register";
    }

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public String registerUser(@ModelAttribute("registerDto") RegisterDto dto, Model model) {

        try {
            this.userService.register(dto);
            return "redirect:/login?success";
        } catch (Exception e) {
            model.addAttribute("error", e.getMessage());
            model.addAttribute("registerDto", dto);
            return "register";
        }
    }

    @RequestMapping(value = "/profile", method = RequestMethod.GET)
    public String showProfilePage(Model model) {

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findByUsername(username).orElse(null);

        if (user != null) {
            model.addAttribute("user", user);
        } else {
            model.addAttribute("msg", "User not found");
        }

        return "profile";
    }

    public boolean isUserLoggedIn() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        return auth != null &&
                auth.isAuthenticated() &&
                auth.getPrincipal() instanceof UserDetails;
    }
}

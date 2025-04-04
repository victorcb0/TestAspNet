using FluentValidation;

public class LoginRequestValidator : AbstractValidator<LoginRequest>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.Username).NotEmpty().WithMessage("Username este obligatoriu.");
        RuleFor(x => x.Password).NotEmpty().WithMessage("Parola este obligatorie.");
    }
}
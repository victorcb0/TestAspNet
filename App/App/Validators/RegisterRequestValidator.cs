using FluentValidation;

public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
    public RegisterRequestValidator()
    {
        RuleFor(x => x.Username).NotEmpty().WithMessage("Username este obligatoriu.");
        RuleFor(x => x.Password).MinimumLength(6).WithMessage("Parola trebuie să aibă cel puțin 6 caractere.");
        RuleFor(x => x.Role).Must(role =>
            role == "Admin" || role == "Operator" || role == "OperatorRaion")
            .WithMessage("Rolul trebuie să fie Admin, Operator sau OperatorRaion.");
    }
}

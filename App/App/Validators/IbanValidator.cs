using FluentValidation;

public class IbanValidator : AbstractValidator<Iban>
{
    public IbanValidator()
    {
        RuleFor(x => x.IbanCode)
            .NotEmpty().WithMessage("IBAN-ul este obligatoriu.")
            .Length(24).WithMessage("IBAN-ul trebuie să conțină exact 24 de caractere.")
            .Must(BeUppercaseLettersAndDigits).WithMessage("IBAN-ul trebuie să conțină doar litere mari și cifre.")
            .Must(StartWithMD).WithMessage("IBAN-ul trebuie să înceapă cu 'MD'.")
            .Must(HaveLast14Digits).WithMessage("Ultimele 14 caractere trebuie să fie cifre.");
    }

    private bool StartWithMD(string? code)
    {
        return !string.IsNullOrWhiteSpace(code) && code.StartsWith("MD");
    }

    private bool BeUppercaseLettersAndDigits(string? code)
    {
        return !string.IsNullOrWhiteSpace(code) &&
               code.All(c => char.IsUpper(c) || char.IsDigit(c));
    }

    private bool HaveLast14Digits(string? code)
    {
        if (string.IsNullOrWhiteSpace(code) || code.Length != 24)
            return false;

        string last14 = code.Substring(10, 14);
        return last14.All(char.IsDigit);
    }
}

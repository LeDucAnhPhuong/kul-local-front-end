namespace kul_local_back_end.utils
{
    using System.Reflection;
    using System.Runtime.Serialization;

    public static class EnumExtensions
    {
        public static string GetEnumMemberValue<T>(this T enumValue) where T : Enum
        {
            return enumValue.GetType()
                .GetMember(enumValue.ToString())[0]
                .GetCustomAttribute<EnumMemberAttribute>()?
                .Value ?? enumValue.ToString();
        }
    }
}

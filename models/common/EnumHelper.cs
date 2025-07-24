using System.Reflection;
using System.Runtime.Serialization;

namespace kul_locall_back_end.models.common
{
    public static class EnumHelper
    {
        public static string GetEnumMemberValue(this Enum enumValue)
        {
            var type = enumValue.GetType();
            var member = type.GetMember(enumValue.ToString())[0];
            var attribute = member.GetCustomAttribute<EnumMemberAttribute>();
            return attribute?.Value ?? enumValue.ToString();
        }
    }
}

package web.util;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.taoxeo.commons.lang.StringUtils;

public class CookieUtil {
	public static String FIRST_GUIDE_STATUS = "mooc_platform_guide";

	/**
	 * 写cookie
	 * 
	 * @param response
	 * @param key
	 * @param value
	 */
	public static void write(HttpServletResponse response, String key, String value) {
		Cookie cookie = new Cookie(key, value);
		cookie.setPath("/");
		cookie.setMaxAge(10*365*24*60*60);//10年
		response.addCookie(cookie);
	}

	/**
	 * 读cookie
	 * 
	 * @param request
	 * @param key
	 * @return
	 */
	public static String read(HttpServletRequest request, String key) {
		Cookie cookies[] = request.getCookies();
		Cookie sCookie = null;
		if (cookies != null) {
			for (int i = 0; i < cookies.length; i++) {
				sCookie = cookies[i];
				if (sCookie.getName() != null && sCookie.getName().equals(key)) {
					if (sCookie.getValue() != null) {
						return sCookie.getValue();
					}
				}
			}
		}
		return null;
	}

	/**
	 * 判断是否是第一次访问
	 * 
	 * @param request
	 * @return
	 */
	public static boolean isFirst(HttpServletRequest request) {
		String sid = CookieUtil.read(request, CookieUtil.FIRST_GUIDE_STATUS);
		return StringUtils.isBlank(sid);
	}

}

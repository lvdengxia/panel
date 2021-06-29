/*
 * @Description: 
 * @Author: fjt
 * @Date: 2021-05-26 16:36:36
 * @LastEditTime: 2021-05-28 17:01:29
 * @LastEditors: fjt
 */
import Layout from './layout.vue'

export default {
    version: '1.0.0',
    path: '/features/details',
    component: Layout,
    hidden: true,
    name: 'coupon',
    meta: {
        title: '优惠券',
        parentMenu: '/plugins/plugins',
    },
    children: [
        {
            path: '/features/coupon/index',
            component: () => import('./index'),
            hidden: true,
            meta: {
                keepAlive: true,
                title: '优惠券',
                activeMenu: '/plugins/features',
                parentMenu: '/plugins/plugins'
            }
        },
        {
            path: '/features/coupon/detail',
            component: () => import('./detail'),
            hidden: true,
            meta: {
                hidden: true,
                title: '优惠券',
                parentMenu: '/plugins/plugins',
                activeMenu: '/plugins/features',
            },
        },
        {
            path: '/features/coupon/success',
            component: () => import('./success'),
            hidden: true,
            meta: {
                hidden: true,
                title: '优惠券新建成功',
                parentMenu: '/plugins/plugins',
                activeMenu: '/plugins/features',
            },
        },
        {
            path: '/features/coupon/send',
            component: () => import('./send'),
            hidden: true,
            meta: {
                hidden: true,
                title: '发放优惠券',
                parentMenu: '/plugins/plugins',
                activeMenu: '/plugins/features',
            },
        },
    ]
}
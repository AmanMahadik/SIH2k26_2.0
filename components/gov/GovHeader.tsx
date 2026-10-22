'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Emblem from './Emblem';
import {
  Bell,
  LogOut,
  User as UserIcon,
  Shield,
  Camera,
  X,
  Check,
  Upload,
  Trash2,
  Mail,
  Phone,
  Building,
  BadgeCheck,
} from 'lucide-react';
import { getClientAuthUser, setClientAuthCookie, clearClientAuthCookie, GovUser } from '@/lib/mock-auth';

interface GovHeaderProps {
  forcedUser?: GovUser;
  showTricolour?: boolean;
}

export default function GovHeader({ forcedUser, showTricolour = false }: GovHeaderProps) {
  const [user, setUser] = useState<GovUser | null>(forcedUser || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state for profile editing
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    avatar: '',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (!forcedUser) {
      const u = getClientAuthUser();
      setUser(u);
      if (u) {
        setFormData({
          name: u.name || '',
          email: u.email || '',
          phone: u.phone || '+91 98201 54321',
          department: u.department || 'Senior Scrutiny Committee, HQ New Delhi',
          avatar: u.avatar || '',
        });
      }
    } else {
      setUser(forcedUser);
      setFormData({
        name: forcedUser.name || '',
        email: forcedUser.email || '',
        phone: forcedUser.phone || '+91 98201 54321',
        department: forcedUser.department || 'Senior Scrutiny Committee, HQ New Delhi',
        avatar: forcedUser.avatar || '',
      });
    }

    const handleUserUpdate = () => {
      const u = getClientAuthUser();
      if (u) setUser(u);
    };
    window.addEventListener('auth_user_updated', handleUserUpdate);
    return () => window.removeEventListener('auth_user_updated', handleUserUpdate);
  }, [forcedUser]);

  const handleOpenModal = () => {
    if (!user) return;
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '+91 98201 54321',
      department: user.department || 'Senior Scrutiny Committee, HQ New Delhi',
      avatar: user.avatar || '',
    });
    setSavedSuccess(false);
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Image size exceeds 2MB limit. Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setFormData((prev) => ({ ...prev, avatar: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setFormData((prev) => ({ ...prev, avatar: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const updatedUser: GovUser = {
      ...user,
      name: formData.name.trim() || user.name,
      email: formData.email.trim() || user.email,
      phone: formData.phone.trim(),
      department: formData.department.trim(),
      avatar: formData.avatar,
    };

    setClientAuthCookie(updatedUser);
    setUser(updatedUser);
    window.dispatchEvent(new Event('auth_user_updated'));

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsModalOpen(false);
    }, 1000);
  };

  const handleLogout = () => {
    clearClientAuthCookie();
    setUser(null);
    router.push('/login');
  };

  return (
    <div className="w-full bg-white border-b border-gov-border select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Left: Official App Logo Banner */}
        <Link href={user ? user.redirectUrl : '/login'} className="flex items-center py-0.5 group">
          <img
            src="/nirikshai_logo.jpg"
            alt="NirikshAI - Application Validation & Compliance Verification | AICTE Regulation Bureau"
            className="h-11 sm:h-13 md:h-14 w-auto object-contain hover:opacity-95 transition-opacity"
          />
        </Link>

        {/* Right side: Authenticated User Controls */}
        {user && (
          <div className="flex items-center space-x-4 sm:space-x-5">
            {/* Clickable Profile Button */}
            <button
              type="button"
              onClick={handleOpenModal}
              title="Click to edit profile & photo"
              className="flex items-center space-x-2.5 p-1 rounded-lg hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200 text-left group cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#0B2E5C]/20"
            >
              {/* Profile Avatar with Hover Camera Badge */}
              <div className="relative w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-600 overflow-hidden shrink-0 group-hover:border-[#0B2E5C] transition-colors">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <UserIcon className="w-4 h-4 text-slate-600 group-hover:text-[#0B2E5C]" />
                )}
                <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-full">
                  <Camera className="w-3 h-3 text-white" />
                </div>
              </div>

              {/* User Name & Role text */}
              <div className="text-right">
                <div className="text-xs sm:text-sm font-bold text-[#0B2E5C] leading-tight group-hover:text-[#1D4E9E] transition-colors">
                  {user.name}
                </div>
                <div className="text-[10px] sm:text-xs text-[#5B6574] font-medium">
                  {user.subText}
                </div>
              </div>
            </button>

            {/* Read-only badge for auditor */}
            {user.role === 'auditor' && (
              <span className="hidden md:inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">
                <Shield className="w-3 h-3 mr-1 text-slate-500" />
                Read-only access
              </span>
            )}

            {/* Notification Bell with red dot */}
            <div className="relative cursor-pointer p-1 rounded hover:bg-slate-50 text-slate-700">
              <Bell className="w-4 h-4 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#B42318] ring-1 ring-white" />
            </div>

            <div className="h-5 w-[1px] bg-slate-200" />

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-[#B42318] transition-colors focus:outline-hidden focus:ring-2 focus:ring-gov-warning px-1.5 py-1 rounded"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      {showTricolour && (
        <div className="w-full flex flex-col h-[3px]" aria-hidden="true">
          <div className="h-[1px] w-full bg-[#FF9933]" />
          <div className="h-[1px] w-full bg-[#FFFFFF]" />
          <div className="h-[1px] w-full bg-[#138808]" />
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT PROFILE MODAL DIALOG                                                 */}
      {/* ========================================================================= */}
      {isModalOpen && user && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-lg border border-slate-300 shadow-2xl max-w-lg w-full p-6 space-y-5 text-xs">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0B2E5C] flex items-center space-x-1.5">
                  <BadgeCheck className="w-4 h-4 text-[#1D4E9E]" />
                  <span>Edit Profile &amp; Contact Credentials</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Update your identity photo, mobile number, and official correspondence details.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Profile Photo Upload Section */}
              <div className="flex items-center space-x-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="relative w-18 h-18 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                  {formData.avatar ? (
                    <img
                      src={formData.avatar}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-8 h-8 text-slate-400" />
                  )}
                </div>

                <div className="space-y-1.5 flex-1">
                  <p className="font-bold text-slate-800 text-xs">Profile Picture</p>
                  <p className="text-[10px] text-slate-500">
                    PNG, JPG or SVG formats up to 2MB. Reflected across all AICTE evaluation seals.
                  </p>
                  <div className="flex items-center space-x-2 pt-0.5">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 bg-[#0B2E5C] hover:bg-[#1D4E9E] text-white text-[11px] font-bold rounded transition-colors shadow-xs"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Upload Photo</span>
                    </button>
                    {formData.avatar && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 text-[11px] font-semibold rounded transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Full Name / Display Title *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 bg-white font-medium focus:ring-2 focus:ring-[#0B2E5C]/20"
                    placeholder="e.g. Prof. R. Kumar"
                  />
                </div>
              </div>

              {/* Email & Mobile Number Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Official Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded text-slate-800 bg-white font-mono text-[11px]"
                      placeholder="e.g. kumar.r@aicte-india.org"
                    />
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded text-slate-800 bg-white font-mono text-[11px]"
                      placeholder="e.g. +91 98201 54321"
                    />
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>
              </div>

              {/* Department / Regional Office */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Department / Regional Bureau *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded text-slate-800 bg-white text-xs"
                    placeholder="e.g. Senior Scrutiny Committee, HQ New Delhi"
                  />
                  <Building className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              {/* Role & ID Read-only Badges */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-[11px] flex justify-between items-center text-slate-600">
                <div>
                  <span className="font-semibold text-slate-500">Authorization Role: </span>
                  <span className="font-bold text-[#0B2E5C] uppercase">{user.role}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">Security Clearance: </span>
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                    Verified
                  </span>
                </div>
              </div>

              {/* Success Notification */}
              {savedSuccess && (
                <div className="p-2.5 rounded bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-xs flex items-center space-x-2 animate-fadeIn">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Profile and photo updated successfully! Reflected across headers.</span>
                </div>
              )}

              {/* Modal Buttons */}
              <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-300 rounded font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0B2E5C] hover:bg-[#1D4E9E] text-white font-bold rounded shadow-xs transition-colors flex items-center space-x-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

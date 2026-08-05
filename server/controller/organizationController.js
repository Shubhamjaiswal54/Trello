import mongoose from "mongoose";
import organizationModel from "../models/organizationModel.js";
import userModel from "../models/userModel.js";

const addorganization = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Organization name is required" });
    }

    const organization = await organizationModel.create({
      name: name,
      owner: req.userId,
      members: [req.userId],
    });

    res.status(201).json({
      message: "Organization created successfully",
      organization,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeOrganization = async (req, res) => {
  try {
    const { organizationId } = req.params;

    // First, find the org to ensure it exists and the user owns it
    const organization = await organizationModel.findById(organizationId);

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Authorization check: Only the owner should be able to delete it
    if (organization.owner.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this organization" });
    }

    await organizationModel.findByIdAndDelete(organizationId);

    res.status(200).json({
      message: "Organization deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getorganization = async (req, res) => {
  try {
    const { organizationId } = req.params;

    const organization = await organizationModel
      .findById(organizationId)
      .populate("members", "-password")
      .populate("owner", "-password");

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.status(200).json({ organization });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getall = async (req, res) => {
  try {
    console.log(req.userId);
    const organization = await organizationModel.find({owner:req.userId});
    res.status(200).json({ organization });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getallme = async (req, res) => {
  try {
    console.log(req.userId);
    const organization = await organizationModel.find({members:req.userId}).select("name _id");
    res.status(200).json({ organization });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const addmember = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { email } = req.body;

    const organization = await organizationModel.findById(organizationId);

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // SAFEGUARD: Added '?.'
    if (organization.owner?.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to add members" });
    }

    const user = await userModel.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // SAFEGUARD: Added '?.' to memberId in case there are nulls in the array
    const isAlreadyMember = organization.members.some(
      (memberId) => memberId?.toString() === user._id.toString(),
    );

    if (isAlreadyMember) {
      return res.status(400).json({ message: "Member already exists" });
    }

    organization.members.push(user._id);
    await organization.save();

    res.status(200).json({
      message: "Member added successfully",
      organization,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const removeMember = async (req, res) => {
  try {
    const { organizationId, memberId } = req.params;

    const organization = await organizationModel.findById(organizationId);

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // SAFEGUARD: Added '?.'
    if (
      organization.owner?.toString() !== req.userId &&
      req.userId !== memberId
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to remove this member" });
    }

    // SAFEGUARD: Added '?.' to member in case there are nulls in the array
    organization.members = organization.members.filter(
      (member) => member?.toString() !== memberId,
    );

    await organization.save();

    res.status(200).json({
      message: "Member removed successfully",
      organization,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export {
  addmember,
  removeMember,
  addorganization,
  removeOrganization,
  getall,
  getorganization,
  getallme,
};

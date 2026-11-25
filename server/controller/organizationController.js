import organizationModel from "../models/organizationModel.js";
import departmentModel from "../models/departmentModel.js";
import boardModel from "../models/boardModel.js";
import cardModel from "../models/cardModel.js";
import userModel from "../models/userModel.js";

const isOwner = (organization, userId) =>
  organization.owner?.toString() === userId;

const addorganization = async (req, res) => {
  const name = req.body.name?.trim();
  if (!name) {
    return res.status(400).json({ message: "Organization name is required" });
  }

  const organization = await organizationModel.create({
    name,
    owner: req.userId,
    members: [req.userId],
  });

  res.status(201).json({
    message: "Organization created successfully",
    organization,
  });
};

// Requires requireOrgAccess, which loads req.org.
const removeOrganization = async (req, res) => {
  const organization = req.org;

  if (!isOwner(organization, req.userId)) {
    return res
      .status(403)
      .json({ message: "Only the owner can delete this organization" });
  }

  await Promise.all([
    cardModel.deleteMany({ orgId: organization._id }),
    boardModel.deleteMany({ orgId: organization._id }),
    departmentModel.deleteMany({ orgId: organization._id }),
  ]);
  await organization.deleteOne();

  res.status(200).json({ message: "Organization deleted successfully" });
};

// Requires requireOrgAccess.
const getorganization = async (req, res) => {
  const organization = await req.org.populate([
    { path: "members", select: "name email" },
    { path: "owner", select: "name email" },
  ]);
  res.status(200).json({ organization });
};

const getall = async (req, res) => {
  const organization = await organizationModel
    .find({ owner: req.userId })
    .select("name owner members");
  res.status(200).json({ organization });
};

const getallme = async (req, res) => {
  const organization = await organizationModel
    .find({ members: req.userId })
    .select("name owner members")
    .sort({ createdAt: -1 });
  res.status(200).json({ organization });
};

// Requires requireOrgAccess.
const addmember = async (req, res) => {
  const organization = req.org;
  const email = req.body.email?.trim().toLowerCase();

  if (!isOwner(organization, req.userId)) {
    return res
      .status(403)
      .json({ message: "Only the owner can add members" });
  }
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    return res
      .status(404)
      .json({ message: "No user is registered with that email" });
  }

  const isAlreadyMember = organization.members.some(
    (memberId) => memberId?.toString() === user._id.toString(),
  );
  if (isAlreadyMember) {
    return res.status(409).json({ message: "That user is already a member" });
  }

  organization.members.push(user._id);
  await organization.save();

  res.status(200).json({
    message: "Member added successfully",
    member: { _id: user._id, name: user.name, email: user.email },
  });
};

// Requires requireOrgAccess. Owners can remove anyone else; members can leave.
const removeMember = async (req, res) => {
  const organization = req.org;
  const { memberId } = req.params;

  if (!isOwner(organization, req.userId) && req.userId !== memberId) {
    return res
      .status(403)
      .json({ message: "Not authorized to remove this member" });
  }
  if (organization.owner.toString() === memberId) {
    return res.status(400).json({
      message: "The owner can't be removed. Delete the organization instead.",
    });
  }

  organization.members = organization.members.filter(
    (member) => member?.toString() !== memberId,
  );
  await organization.save();

  res.status(200).json({ message: "Member removed successfully" });
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
